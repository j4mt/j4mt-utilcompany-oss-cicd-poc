<%@include file="includes/header.jsp" %>

<div class="main center">
    <div class="container">

        <%@include file="includes/left-nav.jsp" %>

        <div class="right-column">

            <div class="panel-heading">
                <h3 class="panel-title">Please Submit Meter Reading</h3>
            </div>

            <div class="panel-body">

                <form:form modelAttribute="meterReadForm" role="form">

                    <form:errors/>

                    <div class="form-group">
                        <form:label path="elecRead">Electricity Read : </form:label>
                        <form:input id="form_meter_read_elec_input" path="elecRead" class="form-control" placeholder="Enter Electricity Reading"/>
                        <form:errors cssClass="error" path="elecRead"/>
                        <p class="help-block">Enter current Electricity reading.</p>
                    </div>

                    <div class="form-group">
                        <form:label path="gasRead">Gas Read : </form:label>
                        <form:input id="form_meter_read_gas_input" path="gasRead" class="form-control" placeholder="Enter Gas Reading"/>
                        <form:errors cssClass="error" path="gasRead"/>
                        <p class="help-block">Enter current Gas reading.</p>
                    </div>

                    <button type="submit" id="submit-meter-read" class="btn btn-default">Submit</button>

                </form:form>
            </div>

        </div>
    </div>
</div>

<%@include file="includes/footer.jsp" %>